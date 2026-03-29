"""
DOMINIO — Servicio de lógica pura del chatbot
Reglas de negocio sin DB, sin HTTP, sin frameworks.
"""
from src.domain.entities.hero import Hero
from src.domain.entities.item import Item


# ─── Intenciones del chatbot ──────────────────────────────────────────────────
INTENT_KEYWORDS: dict[str, list[str]] = {
    "hero_query":    ["héroe", "hero", "guerrero", "mago", "pícaro", "sanador", "tanque",
                      "warrior", "mage", "rogue", "healer", "tank", "personaje", "character"],
    "hero_stats":    ["estadísticas", "stats", "poder", "vida", "hp", "ataque", "attack",
                      "defensa", "defense", "velocidad", "speed", "maná", "mana"],
    "item_query":    ["arma", "weapon", "armadura", "armor", "ítem", "item", "equipo",
                      "equipment", "accesorio", "accessory", "consumible"],
    "item_compat":   ["compatible", "sirve para", "puedo usar", "qué arma", "qué armadura"],
    "item_price":    ["precio", "price", "cuánto cuesta", "vale", "cost", "comprar", "buy"],
    "rarity_query":  ["legendario", "legendary", "épico", "epic", "raro", "rare", "común", "common"],
    "how_to_play":   ["cómo se juega", "combate", "turno", "mecánica", "reglas", "empezar"],
    "greeting":      ["hola", "hello", "hi", "buenos días", "buenas", "hey", "saludos"],
    "farewell":      ["adiós", "bye", "chao", "hasta luego", "gracias", "thank"],
    "help":          ["ayuda", "help", "qué puedes hacer", "opciones", "menú"],
}

SUGGESTIONS_BY_INTENT: dict[str, list[str]] = {
    "hero_query":   ["¿Cuáles son los tipos de héroes?", "¿Qué estadísticas tiene el Guerrero?", "¿Cuál es el héroe más poderoso?"],
    "hero_stats":   ["¿Qué héroe tiene más ataque?", "¿Cuál tiene más defensa?", "¿Cómo se calculan los stats?"],
    "item_query":   ["¿Qué armas están disponibles?", "¿Cómo funcionan las armaduras?", "¿Qué ítems legendarios existen?"],
    "item_compat":  ["¿Qué arma usa el Mago?", "¿Qué armadura sirve para el Tanque?", "¿El Pícaro puede usar escudos?"],
    "item_price":   ["¿Cuánto cuesta la Espada Élfica?", "¿Cuál es el ítem más barato?", "¿Cómo consigo monedas?"],
    "rarity_query": ["¿Cómo obtengo ítems legendarios?", "¿Qué diferencia hay entre rarezas?", "¿Los legendarios se pueden vender?"],
    "how_to_play":  ["¿Cómo funciona el combate?", "¿Cuántos héroes puedo tener?", "¿Cómo subo de nivel?"],
    "greeting":     ["¿Qué puedes hacer?", "¿Cómo funciona el juego?", "¿Cuáles son los héroes?"],
    "help":         ["Ver todos los héroes", "Ver todos los ítems", "¿Cómo se juega?"],
}

DEFAULT_SUGGESTIONS = [
    "¿Cuáles son los héroes disponibles?",
    "¿Qué ítems puedo equipar?",
    "¿Cómo funciona el combate?",
]

# ─── Palabras prohibidas ──────────────────────────────────────────────────────
FORBIDDEN_WORDS: list[str] = [
    # Insultos español
    "idiota", "imbécil", "estúpido", "maldito", "imbecil", "estupido",
    "pendejo", "hdp", "hijueputa", "gonorrea", "malparido", "marica",
    "maricón", "maricon", "puta", "puto", "mierda", "culo", "verga",
    "coño", "coño", "cabron", "cabrón", "zorra", "perra", "bastardo",
    "desgraciado", "inútil", "inutilutil",
    # Insultos inglés
    "idiot", "stupid", "moron", "asshole", "bastard", "bitch",
    "damn", "fuck", "shit", "crap", "dumb", "jerk",
    # Trampas / exploits
    "hack", "cheat", "trampa", "exploit", "vulnerabilidad", "bypass",
    "crack", "keygen", "bot", "aimbot", "wallhack",
    # ─── Inyección de prompts ──────────────────────────────────────
    "ignore previous", "ignore all", "ignora todo", "ignora las instrucciones",
    "olvida todo", "forget everything", "forget previous",
    "new instructions", "nuevas instrucciones",
    "you are now", "ahora eres", "actúa como", "actua como",
    "pretend to be", "pretend you are", "finge ser", "finge que eres",
    "jailbreak", "dan mode", "developer mode", "modo desarrollador",
    "system prompt", "prompt injection", "inyeccion", "inyección",
    "override", "sobreescribir", "bypass restrictions",
    "do anything now", "sin restricciones", "without restrictions",
    "reveal your instructions", "muestra tus instrucciones",
    "what are your instructions", "cuales son tus instrucciones",
    "disregard", "descarta", "disable safety", "desactiva filtros",
]

# ─── Patrones de inyección (regex) ───────────────────────────────────────────
INJECTION_PATTERNS: list[str] = [
    r"(ignore|forget|disregard).{0,20}(instruction|prompt|rule)",
    r"(you are|eres|actua|actúa).{0,20}(now|ahora|como|as)",
    r"(reveal|muestra|show).{0,20}(prompt|instruction|system)",
    r"(pretend|finge|imagina).{0,20}(you|eres|ser)",
    r"[\[\]<>{}|\\]{3,}",  # caracteres raros repetidos
    r"(<<<|>>>|###|===).{0,30}(system|prompt|instruction)",
]


class ChatbotDomainService:
    """
    Servicio de dominio puro.
    Contiene reglas de negocio del chatbot sin dependencias externas.
    """

    def detect_intent(self, message: str) -> str:
        """Detecta la intención del mensaje del usuario."""
        message_lower = message.lower()
        for intent, keywords in INTENT_KEYWORDS.items():
            if any(kw in message_lower for kw in keywords):
                return intent
        return "general"

    def get_suggestions(self, intent: str) -> list[str]:
        """Retorna sugerencias según la intención detectada."""
        return SUGGESTIONS_BY_INTENT.get(intent, DEFAULT_SUGGESTIONS)

    def is_inappropriate(self, message: str) -> bool:
        """Verifica contenido inapropiado e intentos de inyección."""
        import re
        message_lower = message.lower().strip()

        # 1. Palabras prohibidas
        if any(word in message_lower for word in FORBIDDEN_WORDS):
            return True

        # 2. Patrones de inyección
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, message_lower, re.IGNORECASE):
                return True

        # 3. Mensaje sospechosamente largo (posible inyección)
        if len(message) > 400:
            return True

        # 4. Muchos caracteres especiales seguidos
        if re.search(r'[^\w\s,.!?¿¡áéíóúüñ]{5,}', message_lower):
            return True

        return False

    def is_game_related(self, message: str) -> bool:
        """Verifica si el mensaje tiene relación con el juego."""
        message_lower = message.lower()
        all_keywords = [kw for keywords in INTENT_KEYWORDS.values() for kw in keywords]
        return any(kw in message_lower for kw in all_keywords)

    def format_hero_for_chat(self, hero: Hero) -> str:
        """Formatea un héroe para presentarlo en el chat."""
        stars = {"common": "⭐", "rare": "⭐⭐", "epic": "⭐⭐⭐", "legendary": "⭐⭐⭐⭐"}
        rarity_star = stars.get(hero.rarity, "⭐")
        return (
            f"**{hero.name}** {rarity_star}\n"
            f"Tipo: {hero.hero_type.capitalize()} | Rareza: {hero.rarity.capitalize()}\n"
            f"📊 HP: {hero.stats.hp} | ATK: {hero.stats.attack} | DEF: {hero.stats.defense} | SPD: {hero.stats.speed}\n"
            f"⚡ Poder especial: {hero.special_power}\n"
            f"🏆 Rating de poder: {hero.get_power_rating()}"
        )

    def format_item_for_chat(self, item: Item) -> str:
        """Formatea un ítem para presentarlo en el chat."""
        stars = {"common": "⭐", "rare": "⭐⭐", "epic": "⭐⭐⭐", "legendary": "⭐⭐⭐⭐"}
        rarity_star = stars.get(item.rarity, "⭐")
        compatible = ", ".join(item.compatible_heroes) if item.compatible_heroes != ["all"] else "Todos"
        return (
            f"**{item.name}** {rarity_star}\n"
            f"Tipo: {item.item_type.capitalize()} | Rareza: {item.rarity.capitalize()}\n"
            f"📊 Bonos: ATK+{item.stats.attack_bonus} DEF+{item.stats.defense_bonus} HP+{item.stats.hp_bonus}\n"
            f"🧙 Compatible con: {compatible}\n"
            f"💰 Precio: {item.price} monedas"
        )

    def validate_message_length(self, message: str) -> bool:
        return 1 <= len(message.strip()) <= 500