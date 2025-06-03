import { RemoveAnimalDto } from "./dto/RemoveAnimal.dto";
import { AnimalService } from "./animal.service";
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from "@nestjs/swagger";
import { CreateAndAddAnimalDto } from "./dto/CreateAndAddAnimal.dto";
import { UpdateAnimalDto } from "./dto/UpdateAnimal.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Role, Species } from "@prisma/client";
import { AuthGuard } from "@/common/guards/Auth.guard";

@ApiTags("Animals")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@Controller("animal")
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "get all animals" })
  @ApiResponse({ status: 200, description: "List of all animals" })
  async getAllAnimals() {
    return this.animalService.getAllAnimals();
  }

  @Get("search")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "search animals by filters" })
  @ApiResponse({ status: 200, description: "Filtered list of animals" })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "breed", required: false })
  @ApiQuery({ name: "species", required: false, enum: Species })
  async searchAnimals(
    @Query("name") name?: string,
    @Query("breed") breed?: string,
    @Query("species") species?: string,
  ) {
    return this.animalService.searchAnimals({ name, species, breed });
  }

  @Post("")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: "Add a new animal for user" })
  @ApiResponse({ status: 200, description: "Animal successfully created" })
  @ApiResponse({ status: 404, description: "User not found" })
  async createAnimalForUSer(@Body() createAnimalDto: CreateAndAddAnimalDto) {
    return this.animalService.createAnimalForUser(createAnimalDto);
  }

  @Delete("/remove")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: "Remove animal from a use and delete it" })
  async RemoveAnimalDto(@Body() dto: RemoveAnimalDto) {
    return this.animalService.removeAnimalFromUserAndDelete(dto);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Get all animals for a specific user" })
  @ApiResponse({ status: 200, description: "List of animals retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found or has no animals" })
  @ApiParam({ name: "userId", type: Number, description: "ID of the user" })
  async getAllAnimalsForUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.animalService.getAllUserAnimals(userId);
  }

  @Get(":animalId")
  @ApiOperation({ summary: "Get animal by id" })
  @ApiResponse({ status: 200, description: "Animal found" })
  @ApiResponse({ status: 404, description: "Animal not found" })
  @ApiParam({ name: "animalId", type: Number })
  async getAnimalById(@Param("animalId", ParseIntPipe) animalId: number) {
    return this.animalService.getAnimalById(animalId);
  }

  @Put(":animalId")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: "Update animal info" })
  @ApiResponse({ status: 200, description: "Animal successfully udpated" })
  @ApiResponse({ status: 404, description: "animal not found" })
  @ApiParam({ name: "animalId", type: Number, description: "ID of the animal" })
  async updateAnimalInfo(@Param("animalId", ParseIntPipe) animalId: number, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.updateAnimalInfo(animalId, updateAnimalDto);
  }
}
