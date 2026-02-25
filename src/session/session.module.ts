import { Module } from '@nestjs/common';
import { MemoryStore } from 'express-session';
import { UserSecret } from 'project-config/token_config';

@Module({
  imports: [],
  providers: [
    {
      provide: 'SESSION_OPTIONS',
      useValue: {
        secret: UserSecret.SeSSSct || 'secret-key',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(),
        cookie: {
          maxAge: 3600000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production' ? true : false,
        },
      },
    },
  ],
})
export class SessionModule {}
