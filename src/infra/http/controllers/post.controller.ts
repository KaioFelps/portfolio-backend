import { Controller } from '@nestjs/common';

@Controller('post')
export class PostController {
  constructor() {}

  async get() {
    throw new Error('Missing Post.get implementation.');
  }

  async getMany() {
    throw new Error('Missing Post.getMany implementation.');
  }

  async create() {
    throw new Error('Missing Post.create implementation.');
  }

  async update() {
    throw new Error('Missing Post.update implementation.');
  }

  async delete() {
    throw new Error('Missing Post.delete implementation.');
  }
}
