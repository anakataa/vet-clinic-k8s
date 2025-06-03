import { UserRepository } from "@/user/repositories/user.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AnimalRepository } from "./repositories/animal.repository";
import { Transactional } from "@nestjs-cls/transactional";
import { CreateAndAddAnimalDto } from "./dto/CreateAndAddAnimal.dto";
import { UpdateAnimalDto } from "./dto/UpdateAnimal.dto";
import { RemoveAnimalDto } from "./dto/RemoveAnimal.dto";
import { toCamelCase } from "@/common/utils/toCamelCase";

@Injectable()
export class AnimalService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly animalRepository: AnimalRepository,
  ) {}

  @Transactional()
  async getAnimalById(animalId: number) {
    const animal = await this.animalRepository.getById(animalId);
    if (!animal) {
      throw new NotFoundException("Animal not found");
    }

    return animal;
  }

  @Transactional()
  async getAllAnimals() {
    const animals = await this.animalRepository.getAll();
    return toCamelCase(animals) as unknown;
  }

  @Transactional()
  async searchAnimals(query: { name?: string; species?: string; breed?: string }) {
    const animals = await this.animalRepository.searchByAnimals(query);
    return toCamelCase(animals) as unknown;
  }

  @Transactional()
  async createAnimalForUser({ age, breed, gender, name, species, userId }: CreateAndAddAnimalDto) {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new NotFoundException("User with this id not found");
    }

    const newAnimal = await this.userRepository.addAnimalToUser(userId, {
      name,
      breed,
      gender,
      age,
      species,
    });

    return toCamelCase(newAnimal) as unknown;
  }

  @Transactional()
  async updateAnimalInfo(animalId: number, updateAnimalDto: UpdateAnimalDto) {
    const animal = await this.animalRepository.getById(animalId);

    if (!animal) {
      throw new NotFoundException("Animal with this id not found");
    }

    const updatedAnimal = await this.animalRepository.updateAnimal(animalId, updateAnimalDto);

    return toCamelCase(updatedAnimal) as unknown;
  }

  @Transactional()
  async removeAnimalFromUserAndDelete(removeAnimalDto: RemoveAnimalDto) {
    try {
      const removed = await this.animalRepository.removeAnimalFromUserAndDelete(
        removeAnimalDto.userId,
        removeAnimalDto.animalId,
      );
      return removed;
    } catch (e) {
      console.log(e);
      throw new NotFoundException("Animal not found or doesn`t belong to this");
    }
  }

  async getAllUserAnimals(userId: number) {
    return this.animalRepository.getByUserId(userId);
  }
}
