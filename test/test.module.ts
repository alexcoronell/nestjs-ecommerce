import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

export const testModule = Test.createTestingModule({ imports: [AppModule] });
