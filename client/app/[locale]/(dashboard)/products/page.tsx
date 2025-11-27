import { useTranslations } from 'next-intl';
import { productApi } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProductsPage() {
  const t = useTranslations('Products');
  
  let products = [];
  try {
    const data = await productApi.getAll();
    products = data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          Manage your product catalog
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No products found</CardTitle>
              <CardDescription>
                Start by creating your first product
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          products.map((product: any) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.description || 'No description'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
