
import { supabase } from './lib/supabase';
import { INITIAL_PRODUCTS } from './constants';

export const seedDatabase = async () => {
    console.log('Seeding products...');

    const productsToInsert = INITIAL_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        base_price: p.basePrice,
        category: p.category,
        images: p.images,
        variants: p.variants || [],
        notes: p.notes,
        seasons: p.seasons
    }));

    const { error } = await supabase
        .from('products')
        .upsert(productsToInsert, { onConflict: 'id' });

    if (error) {
        console.error('Error seeding products:', error);
    } else {
        console.log('Products seeded successfully!');
    }
};
