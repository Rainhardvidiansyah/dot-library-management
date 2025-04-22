import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({name: "roles"})
export class RolesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      name: "role_name",
      nullable: false,
      type: "varchar",
      length: 50,        
      unique: true,
      //enum: ["ADMIN", "READER", "AUTHOR"] // or any other roles you want to support
    })
    roleName: string;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt: Date;
      
    @UpdateDateColumn({
      name: "updated_at"
    })
    updatedAt: Date;
      
    @DeleteDateColumn({
        name: "deleted_at"
    })
    deletedAt?: Date;

    
}