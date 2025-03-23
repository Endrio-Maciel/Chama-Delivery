import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
            context.getHandler(),
            context.getClass(),
        ])

        if(!requiredRoles) return true

        const request = context.switchToHttp().getRequest()
        const user = request.user

        if(!user || !user.role) return false

        return requiredRoles.some(role => user.role.includes(role))
    }
}