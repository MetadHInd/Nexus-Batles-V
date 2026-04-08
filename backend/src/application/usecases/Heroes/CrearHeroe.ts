import { Heroe } from "../../../domain/entities/Heroe";

export class CrearHeroe {

  constructor(private heroRepository: any) {}

  async ejecutar(data: {
    name: string;
    description: string;
    price: number;
    stars: number;
    type: 'principal' | 'secundario';
    image: string;
  }): Promise<Heroe> {

    const hero = new Heroe(
      null,
      data.name,
      data.description,
      data.price,
      data.stars,
      data.type,
      data.image
    );

    return await this.heroRepository.create(hero);
  }
}