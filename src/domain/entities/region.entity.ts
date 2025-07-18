import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { City } from "./city.entity";
import { Office } from "./offices.entity";
import { Property } from "./property.entity";
import { UserPost } from "./user-post.entity";
import { ServiceProvider } from "./service-provider.entity";

@Unique(['name', 'city'])
@Entity('regions')
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => City, city => city.regions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'city_id' }) 
    city: City;

    @Column({
        type:'decimal',
        precision:5
    })
    default_meter_price;

    @OneToMany(() => Office, office => office.region)
    offices: Office[];

    @OneToMany(() => Property, (property) => property.region)
    properties: Property[];

    @OneToMany(() => UserPost, post => post.region)
    userPosts: UserPost[];

    @OneToMany(() => ServiceProvider, (sp) => sp.region)
    serviceProviders: ServiceProvider[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}