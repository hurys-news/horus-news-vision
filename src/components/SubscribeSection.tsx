
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد إلكتروني صالح",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally send the email to your API
    toast({
      title: "تم الاشتراك بنجاح",
      description: "سيصلك كل جديد من حورس نيوز!",
    });
    
    setEmail('');
  };
  
  return (
    <section className="py-12 bg-horus-blue text-white">
      <div className="container mx-auto text-center">
        <h2 className="font-cairo font-bold text-2xl md:text-3xl mb-2">ابق على اطلاع</h2>
        <p className="max-w-2xl mx-auto mb-6">اشترك في النشرة البريدية ليصلك آخر الأخبار والتحليلات مباشرة إلى بريدك الإلكتروني</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            className="flex-1 bg-white text-gray-800 placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="bg-horus-red hover:bg-red-700">
            اشتراك
          </Button>
        </form>
      </div>
    </section>
  );
};

export default SubscribeSection;
