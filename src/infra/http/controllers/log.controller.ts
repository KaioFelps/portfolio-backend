import { Controller } from '@nestjs/common';

@Controller('log')
export class LogController {
  constructor() {}

  async get() {
    throw new Error('Missing Log.get implementation.');
  }

  async getMany() {
    throw new Error('Missing Log.getMany implementation.');
  }

  async create() {
    throw new Error('Missing Log.create implementation.');
  }

  async update() {
    throw new Error('Missing Log.update implementation.');
  }

  async delete() {
    throw new Error('Missing Log.delete implementation.');
  }
}
