import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Field()
  @Column()
  public adminId!: number;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: string;

  @Field()
  @Column({ type: "set", enum: ["dm", "group"] })
  public type: string;

  @ManyToOne(() => User)
  public admin!: User;
}
