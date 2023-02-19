import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Group } from "./Group";

@ObjectType()
@Entity()
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @Column()
  public groupId!: number;

  @ManyToOne(() => Group)
  public group!: Group;
}
