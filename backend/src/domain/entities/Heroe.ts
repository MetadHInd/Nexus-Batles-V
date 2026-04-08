export class Heroe {
  constructor(
    public id: number | null,
    public name: string,
    public description: string,
    public price: number,
    public stars: number,
    public type: 'principal' | 'secundario',
    public image: string
  ) {
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("El nombre del héroe es obligatorio");
    }

    if (this.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }

    if (this.stars < 1 || this.stars > 5) {
      throw new Error("Las estrellas deben estar entre 1 y 5");
    }

    if (!this.image) {
      throw new Error("La imagen es obligatoria");
    }
  }
}