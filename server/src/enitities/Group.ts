import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: string;

  @Field()
  @Column({ type: "set", enum: ["dm", "group"] })
  public type: string;
}
