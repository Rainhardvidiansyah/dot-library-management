import { UsersEntity } from "src/users/entities/users.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({name: 'refresh_tokens'})
export class RefreshTokenEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false,
        unique: true 
    })
    token: string;

    @ManyToOne(() => UsersEntity, (user) => user.refreshToken, { eager: true })
    @JoinColumn({ name: 'user_id'})
    user: UsersEntity;

    @Column({name: "is_revoked", default: false})
    isRevoked: boolean;

    @Column({name: "expires_at", type: "timestamp", nullable: false})
    expiresAt: Date;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
      
    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;
      
    @DeleteDateColumn({name: "deleted_at", nullable: true})
    deletedAt?: Date;

   
    

}