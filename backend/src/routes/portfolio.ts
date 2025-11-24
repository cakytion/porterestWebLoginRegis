import { supabase } from '../supabase';

export default (app) => {
    // GET portfolio
    app.get('/portfolio/:id', async ({ params }) => {
        const { data, error } = await supabase
            .from('portfolios')
            .select('*, portfolio_images(*)')
            .eq('id', params.id)
            .single();

        return error ? { error } : data;
    });

    // UPDATE portfolio
    app.put('/portfolio/:id', async ({ params, body }) => {
        const { title, description } = body;

        const { data, error } = await supabase
            .from('portfolios')
            .update({ title, description, updated_at: new Date() })
            .eq('id', params.id)
            .select();

        return error ? { error } : data;
    });

    // DELETE portfolio
    app.delete('/portfolio/:id', async ({ params }) => {
        const { error } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', params.id);

        return error ? { error } : { success: true };
    });
};
