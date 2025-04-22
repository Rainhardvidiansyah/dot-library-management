import { Exclude } from 'class-transformer';
import { RefreshTokenEntity } from 'src/refresh-token/entities/refresh-token.entity';
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'email',
    length: 100,
    nullable: false,
    type: 'varchar',
  })
  email: string;

  @Exclude()
  @Column({
    length: 100,
    nullable: false,
    type: 'varchar',
  })
  password: string;

  @Column({ 
    name: "is_active",
    default: false })
isActive: boolean;

  @ManyToMany(() => RolesEntity)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RolesEntity[];

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user, { onDelete: "CASCADE" } )
  refreshToken: RefreshTokenEntity[];

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
