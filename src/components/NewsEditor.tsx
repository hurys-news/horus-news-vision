
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignJustify, AlignRight, List, ListOrdered, Link, Image } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface NewsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const NewsEditor = ({ value, onChange }: NewsEditorProps) => {
  const [content, setContent] = useState(value);
  const [previewMode, setPreviewMode] = useState(false);

  // تحديث القيمة عند تغييرها من الخارج
  useEffect(() => {
    setContent(value);
  }, [value]);

  // تحديث القيمة الخارجية عند تغييرها داخلياً
  const handleChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  // إضافة تنسيق للنص المحدد
  const applyFormat = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;

    switch(format) {
      case 'bold':
        newText = content.substring(0, start) + `<strong>${selectedText}</strong>` + content.substring(end);
        break;
      case 'italic':
        newText = content.substring(0, start) + `<em>${selectedText}</em>` + content.substring(end);
        break;
      case 'underline':
        newText = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end);
        break;
      case 'align-right':
        newText = content.substring(0, start) + `<div style="text-align: right;">${selectedText}</div>` + content.substring(end);
        break;
      case 'align-center':
        newText = content.substring(0, start) + `<div style="text-align: center;">${selectedText}</div>` + content.substring(end);
        break;
      case 'align-justify':
        newText = content.substring(0, start) + `<div style="text-align: justify;">${selectedText}</div>` + content.substring(end);
        break;
      case 'align-left':
        newText = content.substring(0, start) + `<div style="text-align: left;">${selectedText}</div>` + content.substring(end);
        break;
      case 'list':
        newText = content.substring(0, start) + `<ul>\n  <li>${selectedText}</li>\n</ul>` + content.substring(end);
        break;
      case 'list-ordered':
        newText = content.substring(0, start) + `<ol>\n  <li>${selectedText}</li>\n</ol>` + content.substring(end);
        break;
      case 'link': {
        const url = prompt('أدخل الرابط:', 'https://');
        if (url) {
          newText = content.substring(0, start) + `<a href="${url}" target="_blank">${selectedText || url}</a>` + content.substring(end);
        }
        break;
      }
      case 'image': {
        const url = prompt('أدخل رابط الصورة:', 'https://');
        if (url) {
          const alt = prompt('أدخل نص بديل للصورة:', selectedText);
          newText = content.substring(0, start) + `<img src="${url}" alt="${alt || ''}" style="max-width: 100%;">` + content.substring(end);
        }
        break;
      }
      default:
        break;
    }

    handleChange(newText);
    
    // إعادة التركيز إلى النص
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }, 0);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 flex flex-wrap items-center gap-1 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? 'المحرر' : 'معاينة'}
        </Button>
        
        {!previewMode && (
          <>
            <div className="h-5 border-r mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('bold')}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('italic')}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('underline')}>
              <Underline className="h-4 w-4" />
            </Button>
            
            <div className="h-5 border-r mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('align-right')}>
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('align-center')}>
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('align-justify')}>
              <AlignJustify className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('align-left')}>
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <div className="h-5 border-r mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('list')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('list-ordered')}>
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <div className="h-5 border-r mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('link')}>
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormat('image')}>
              <Image className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {previewMode ? (
        <div 
          className="p-4 min-h-[200px] prose prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Textarea
          id="content-editor"
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[200px] rounded-none border-0 focus-visible:ring-0 resize-y"
          placeholder="أدخل محتوى المقال هنا..."
        />
      )}
    </div>
  );
};

export default NewsEditor;
