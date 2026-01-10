import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { WorkspacesService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
  ){}

  @Post()
  create(@Body() dto: CreateWorkspaceDto, @Req() req) {
    return this.workspacesService.create(dto, req.user.userId);
  }

  @Post('accept-invite')
  acceptInvite(@Body('token') token: string, @Req() req) {
    return this.workspacesService.acceptInvitation(token, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto, @Req() req) {
    return this.workspacesService.update(id, dto, req.user.userId);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string, @Req() req) {
    return this.workspacesService.getMembers(id, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.workspacesService.delete(id, req.user.userId);
  }

  @Post(':id/invite')
  invite(@Param('id') id: string, @Body('email') email: string, @Req() req) {
    return this.workspacesService.inviteMember(email, id, req.user);
  }
}