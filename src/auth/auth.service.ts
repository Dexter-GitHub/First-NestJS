import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private userRepository: UserRepository
    constructor(
        private dataSource: DataSource,
        private jwtService: JwtService
    ) {
        this.userRepository = new UserRepository(this.dataSource);
    }    

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ 
            where: { username: username } 
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 (Secret + Payload)
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken: accessToken };
        }
        else {
            throw new UnauthorizedException('login failed');
        }
    }
}
