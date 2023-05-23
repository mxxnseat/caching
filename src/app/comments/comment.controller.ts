import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly _commentService: CommentService) {}

  @Get('')
  public async list(@Query() options: any): Promise<any> {
    const comment = await this._commentService.list(options);
    return comment;
  }

  @Get(':id_comment')
  public async retrieve(
    @Param('id_comment') idComment: string,
    @Query() options: any,
  ): Promise<any> {
    const comment = await this._commentService.retrieve(idComment, options);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }
}
