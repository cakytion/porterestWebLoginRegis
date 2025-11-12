import { t } from 'elysia';
import path from 'path';

export const setupPortfolioRoutes = (app) => {
  app.post(
    '/api/portfolios', 
    async ({ body, set }) => {
      try {
        const { title, description, images } = body;

        const imageUrls = [];

        for (const file of images) {
          const filename = `${Date.now()}-${file.name}`;
          
          const savePath = path.join('uploads', filename);

          await file.write(savePath);

          imageUrls.push(savePath);
        }

        console.log('ข้อมูลที่จะบันทึกลง DB:', { title, description, imageUrls });


        set.status = 201; 
        return { message: 'Portfolio uploaded successfully!' };

      } catch (error) {
        console.error('Error uploading:', error);
        set.status = 500;
        return { message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' };
      }
    },
    {
      
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        images: t.Files(), 
      }),
    }
  );

  return app;
};