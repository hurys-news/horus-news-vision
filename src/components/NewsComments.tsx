
import { useState } from 'react';
import { ArrowDown, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

interface NewsCommentsProps {
  newsId: string;
  commentsCount: number;
}

// بيانات تجريبية للتعليقات
const sampleComments: Comment[] = [
  {
    id: 1,
    author: 'أحمد محمود',
    avatar: 'https://source.unsplash.com/random/100x100/?man',
    content: 'خبر رائع ومهم للغاية. أتمنى أن تستمر هذه الاتفاقيات في تعزيز التعاون الاقتصادي بين الدول العربية.',
    date: 'منذ 3 ساعات',
    likes: 12
  },
  {
    id: 2,
    author: 'سارة عبدالله',
    avatar: 'https://source.unsplash.com/random/100x100/?woman',
    content: 'أتساءل عن الجدول الزمني لتنفيذ هذه المشاريع وتأثيرها على الاقتصاد المحلي على المدى القصير.',
    date: 'منذ 5 ساعات',
    likes: 8
  },
  {
    id: 3,
    author: 'محمد السيد',
    avatar: 'https://source.unsplash.com/random/100x100/?man2',
    content: 'هذه الاتفاقية خطوة إيجابية نحو تحقيق الاكتفاء الذاتي في مجال الطاقة المتجددة وخلق فرص عمل جديدة للشباب.',
    date: 'منذ يوم واحد',
    likes: 15
  }
];

const NewsComments = ({ newsId, commentsCount }: NewsCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    // إضافة تعليق جديد (في التطبيق الحقيقي سيتم إرساله إلى الخادم)
    const newComment: Comment = {
      id: comments.length + 1,
      author: 'أنت',
      avatar: 'https://source.unsplash.com/random/100x100/?person',
      content: commentText,
      date: 'الآن',
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };
  
  // عرض 3 تعليقات فقط إذا لم يتم النقر على "عرض المزيد"
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">التعليقات ({commentsCount})</h2>
      
      {/* نموذج إضافة تعليق */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://source.unsplash.com/random/100x100/?person" />
            <AvatarFallback>أنت</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="أضف تعليقك..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mb-3"
            />
            <Button onClick={handleSubmitComment} className="flex items-center">
              إرسال
              <Send className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* قائمة التعليقات */}
      <div className="space-y-6">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.avatar} />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{comment.author}</h4>
                  <span className="text-gray-500 text-sm">{comment.date}</span>
                </div>
                <p className="text-gray-800">{comment.content}</p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <button className="mr-4 hover:text-horus-red transition-colors">رد</button>
                <button className="hover:text-horus-red transition-colors">
                  إعجاب ({comment.likes})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* زر عرض المزيد من التعليقات */}
      {!showAllComments && comments.length > 3 && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            className="flex items-center mx-auto"
            onClick={() => setShowAllComments(true)}
          >
            عرض المزيد من التعليقات
            <ArrowDown className="mr-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsComments;
