// types/index.ts
export interface SubModule {
    id: string;
    number: string;
    title: string;
    moduleId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Module {
    id: string;
    number: string;
    title: string;
    description: string | null;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    subModules: SubModule[];
  }
  
  export interface UserModule {
    id: string;
    userId: string;
    moduleId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    module: Module;
  }