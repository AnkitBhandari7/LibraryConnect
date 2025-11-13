import { Entity} from "typeorm";
import {PrimaryGeneratedColumn} from "typeorm";
import { Column } from "typeorm";
@Entity()
export class Book{
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    author!: string;


    @Column({nullable: true})
    isbn?: string;

    @Column({type:"int",nullable: true})
    publishedYear?: number;

    @Column({type:"text", nullable: true})
    summary?: string;



}