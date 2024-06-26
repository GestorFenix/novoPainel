import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, NotFoundException, Param, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  clientLimit: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('user/:id/limit')
@ApiTags('Franquias')
export class UpdateClientsLimit {
  constructor(private readonly prisma: PrismaService) {}

  @Put()
  @ApiOperation({
    summary: 'Rota para atualizar o limite de clientes da franquia.',
  })
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @Param('id') id: string,
  ) {
    const { clientLimit } = body

    const franchise = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!franchise) throw new NotFoundException('Resource not found.')

    await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        clientLimit: Number(clientLimit),
      },
    })
  }
}
