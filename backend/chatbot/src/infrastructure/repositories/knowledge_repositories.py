"""
INFRAESTRUCTURA — Repositorios en memoria (JSON)
Implementa los contratos del dominio.
En producción esto se reemplaza por MySQL sin tocar el dominio.
"""
import glob
import json
import os
from typing import Optional

from src.domain.entities.hero import Hero, HeroStats
from src.domain.entities.item import Item, ItemStats
from src.domain.repositories.contracts import (
    HeroRepositoryPort,
    ItemRepositoryPort,
    KnowledgeRepositoryPort,
)


def _get_knowledge_base_path() -> str:
    base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    return os.path.join(base, "knowledge_base")


def _load_json(filename: str) -> dict:
    path = os.path.join(_get_knowledge_base_path(), filename)
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _merge_json_objects(dest: dict, src: dict) -> None:
    for key, value in src.items():
        if key in dest:
            if isinstance(dest[key], dict) and isinstance(value, dict):
                _merge_json_objects(dest[key], value)
                continue
            if isinstance(dest[key], list) and isinstance(value, list):
                dest[key].extend(value)
                continue
        dest[key] = value


def _load_all_knowledge_json() -> dict:
    merged = {}
    base_path = _get_knowledge_base_path()
    for path in sorted(glob.glob(os.path.join(base_path, "*.json"))):
        filename = os.path.basename(path)
        data = _load_json(filename)
        if isinstance(data, dict):
            _merge_json_objects(merged, data)
    return merged


def _to_int(value) -> int:
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.isdigit():
        return int(value)
    return 0


def _build_item_stats(raw: dict) -> ItemStats:
    if not isinstance(raw, dict):
        return ItemStats()

    stats = ItemStats()
    effects = raw.get("effects", {})
    if isinstance(effects, dict):
        stats.attack_bonus = _to_int(effects.get("attack_bonus", effects.get("damage_bonus", 0)))
        stats.defense_bonus = _to_int(effects.get("defense_bonus", 0))
        stats.speed_bonus = _to_int(effects.get("speed_bonus", 0))
        stats.hp_bonus = _to_int(effects.get("health_bonus", effects.get("hp_bonus", 0)))
        stats.mana_bonus = _to_int(effects.get("mana_bonus", 0))
    return stats


def _create_item_from_raw(raw: dict, item_type: str, rarity: str = "rare") -> Item:
    description = raw.get("description", raw.get("efecto", ""))
    hero_type = raw.get("hero_type", raw.get("tipo", raw.get("subtype", "all")))
    if isinstance(hero_type, str) and hero_type.strip() == "":
        hero_type = "all"

    return Item(
        id=raw["id"],
        name=raw["name"],
        item_type=item_type,
        rarity=rarity,
        stats=_build_item_stats(raw),
        compatible_heroes=[hero_type],
        description=description,
        price=raw.get("price", 0),
        tradeable=raw.get("tradeable", True),
    )


class InMemoryHeroRepository(HeroRepositoryPort):
    """
    Adaptador de repositorio — lee desde knowledge_base/heroes.json.
    Implementa el contrato HeroRepositoryPort del dominio.
    """

    def __init__(self):
        self._heroes: dict[str, Hero] = {}
        self._load()

    def _load(self):
        data = _load_json("heroes.json")
        for raw in data.get("heroes", []):
            s = raw["stats"]
            stats = HeroStats(
                hp=s.get("vida", s.get("hp", 0)),
                attack=s.get("ataque", s.get("attack", "10")),
                defense=s.get("defensa", s.get("defense", 0)),
                speed=s.get("poder", s.get("speed", 0)),
                mana=s.get("poder", s.get("mana", 0)),
            )
            hero = Hero(
                id=raw["id"],
                name=raw["name"],
                hero_type=raw["hero_type"],
                rarity=raw["rarity"],
                stats=stats,
                abilities=raw.get("abilities", []),
                lore=raw.get("lore", ""),
                special_power=raw.get("special_power", ""),
            )
            self._heroes[hero.id] = hero

    def find_by_id(self, hero_id: str) -> Optional[Hero]:
        return self._heroes.get(hero_id)

    def find_by_type(self, hero_type: str) -> list[Hero]:
        return [h for h in self._heroes.values() if h.hero_type == hero_type]

    def find_by_rarity(self, rarity: str) -> list[Hero]:
        return [h for h in self._heroes.values() if h.rarity == rarity]

    def find_all(self) -> list[Hero]:
        return list(self._heroes.values())

    def search(self, query: str) -> list[Hero]:
        q = query.lower()
        return [
            h for h in self._heroes.values()
            if q in h.name.lower() or q in h.hero_type.lower() or q in h.lore.lower()
        ]


class InMemoryItemRepository(ItemRepositoryPort):
    """
    Adaptador de repositorio — lee desde knowledge_base/items.json, arma.json y armaduras.json.
    Implementa el contrato ItemRepositoryPort del dominio.
    """

    def __init__(self):
        self._items: dict[str, Item] = {}
        self._load()

    def _load(self):
        self._load_from_items_json()
        self._load_from_arma_json()
        self._load_from_armaduras_json()

    def _load_from_items_json(self):
        data = _load_json("items.json")

        for raw in data.get("items", []):
            item = _create_item_from_raw(raw, item_type="item", rarity="rare")
            self._items[item.id] = item

        for raw in data.get("weapons", []):
            item = _create_item_from_raw(raw, item_type="weapon", rarity="common")
            self._items[item.id] = item

        for raw in data.get("armor", []):
            item = _create_item_from_raw(raw, item_type="armor", rarity="common")
            self._items[item.id] = item

    def _load_from_arma_json(self):
        data = _load_json("arma.json")
        for raw in data.get("arma", []):
            item = _create_item_from_raw(raw, item_type="weapon", rarity="common")
            self._items[item.id] = item

    def _load_from_armaduras_json(self):
        data = _load_json("armaduras.json")
        for raw in data.get("armaduras", []):
            item = _create_item_from_raw(raw, item_type="armor", rarity="common")
            self._items[item.id] = item

    def find_by_id(self, item_id: str) -> Optional[Item]:
        return self._items.get(item_id)

    def find_by_type(self, item_type: str) -> list[Item]:
        return [i for i in self._items.values() if i.item_type == item_type]

    def find_compatible_with(self, hero_type: str) -> list[Item]:
        return [i for i in self._items.values() if i.is_compatible_with(hero_type)]

    def find_all(self) -> list[Item]:
        return list(self._items.values())

    def search(self, query: str) -> list[Item]:
        q = query.lower()
        return [
            i for i in self._items.values()
            if q in i.name.lower() or q in i.item_type.lower() or q in i.description.lower()
        ]


class InMemoryKnowledgeRepository(KnowledgeRepositoryPort):
    """
    Adaptador de repositorio — carga todo el JSON de knowledge_base.
    """

    def __init__(self):
        self._knowledge = _load_all_knowledge_json()

    def load(self) -> dict:
        return self._knowledge.copy()
