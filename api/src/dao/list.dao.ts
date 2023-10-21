import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateListDto } from '../lists/dtos/update-list.dto';
import { CreateListDto } from '../lists/dtos/create-list.dto';

@Injectable()
export class ListDao {
	constructor(private readonly prisma: PrismaService) {}

	async getList(listId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			select: {
				id: true,
				name: true,
				is_private: true,
				creator_id: true,
				created_at: true,
				updated_at: true,
				Movie: true,
				User: true,
			},
		});

		list.User = list.User.filter((user) => user.id === list.creator_id);

		return list;
	}

	async getLists(userId: string) {
		return this.prisma.user.findUniqueOrThrow({
			where: { id: userId },
			include: {
				List: {
					orderBy: {
						created_at: 'desc',
					},
					select: {
						id: true,
						name: true,
						is_private: true,
						creator_id: true,
						created_at: true,
						updated_at: true,
						Movie: true,
					},
				},
			},
		});
	}

	async getSharees(listId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: {
				User: {
					orderBy: {
						username: 'asc',
					},
					select: {
						id: true,
						username: true,
						email: true,
						// avatar: true,
					},
				},
			},
		});

		return list;
	}

	async createList(createList: CreateListDto, userId: string) {
		const list = await this.prisma.list.create({
			data: {
				name: createList.name,
				is_private: true,
				creator_id: userId,
				User: {
					connect: { id: userId },
				},
			},
			include: {
				Movie: true,
			},
		});

		if (createList?.Movie?.length) {
			// iterate over new movies, get new ids
			const newMovies = await Promise.all(
				createList.Movie.map((movie) =>
					this.prisma.movie.upsert({
						where: { title: movie.title },
						create: {
							title: movie.title,
							description: movie.description,
							genre: movie.genre,
							release_date: movie.release_date,
							poster_url: movie.poster_url,
							rating: movie.rating,
							imdb_id: movie.imdb_id,
						},
						update: {},
					}),
				),
			);

			// associate ids
			await Promise.all(
				newMovies.map((movie) =>
					this.prisma.movie.update({
						where: { id: movie.id },
						data: {
							List: {
								connect: {
									id: list.id,
								},
							},
						},
					}),
				),
			);
		}

		const createdList = await this.prisma.list.findUniqueOrThrow({
			where: { id: list.id },
			include: {
				Movie: true,
			},
		});

		return createdList;
	}

	async updateListPrivacy(listId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: { User: true, Movie: true },
		});

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				is_private: !list.is_private,
			},
		});
	}

	async updateList(updateListDto: UpdateListDto) {
		let newMovies = [];
		// add new movies to list
		if (updateListDto?.Movie?.length) {
			// iterate over new movies, get new ids
			newMovies = await Promise.all(
				updateListDto.Movie.map((movie) =>
					this.prisma.movie.upsert({
						where: { title: movie.title },
						create: {
							title: movie.title,
							description: movie.description,
							genre: movie.genre,
							release_date: movie.release_date,
							poster_url: movie.poster_url,
							rating: movie.rating,
							imdb_id: movie.imdb_id,
						},
						// do not update the movie table
						update: {},
					}),
				),
			);

			// associate ids
			await Promise.all(
				newMovies.map((movie) =>
					this.prisma.movie.update({
						where: { id: movie.id },
						data: {
							List: {
								connect: {
									id: updateListDto.listId,
								},
							},
						},
					}),
				),
			);
		}

		return await this.prisma.list.update({
			where: { id: updateListDto.listId },
			data: {
				name: updateListDto.name,
			},
			include: { Movie: true },
		});
	}

	async deleteList(listId: string, userId: string) {
		return await this.prisma.user.update({
			where: { id: userId },
			data: {
				List: {
					delete: {
						id: listId,
						creator_id: userId,
					},
				},
			},
		});
	}

	async deleteListItem(listId: string, movieId: string) {
		await this.prisma.list.update({
			where: { id: listId },
			data: {
				Movie: {
					disconnect: { id: movieId },
				},
			},
		});
	}

	async toggleShareList(listId: string, email: string) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { email },
			include: {
				List: {
					where: {
						id: listId,
					},
				},
			},
		});

		const isConnected = user.List.some((list) => list.id === listId);

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				User: {
					...(isConnected
						? {
								disconnect: { email },
						  }
						: { connect: { email } }),
				},
			},
		});
	}
}