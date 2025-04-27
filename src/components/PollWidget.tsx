import { useState } from 'react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

const PollWidget = () => {
  const [question] = useState('ما هو أكثر موضوع يهمك متابعته في الأخبار؟');
  const [options] = useState<PollOption[]>([
    { id: '1', text: 'السياسة والعلاقات الدولية', votes: 42 },
    { id: '2', text: 'الاقتصاد والأعمال', votes: 28 },
    { id: '3', text: 'التكنولوجيا والابتكار', votes: 15 },
    { id: '4', text: 'الرياضة', votes: 35 },
  ]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* العنوان */}
      <div className="flex items-center">
        <h3 className="bg-horus-red text-white px-4 py-1.5 text-sm font-bold">استطلاع رأي</h3>
      </div>

      {/* محتوى الاستطلاع */}
      <div className="p-4">
        {/* السؤال */}
        <h4 className="text-sm font-bold mb-4 text-right">{question}</h4>

        {/* الخيارات */}
        <div className="space-y-2">
          {options.map((option) => (
            <div 
              key={option.id} 
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                selectedOption === option.id ? 'border-horus-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => !hasVoted && setSelectedOption(option.id)}
            >
              <div className="text-sm text-right">{option.text}</div>
              
              {hasVoted && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-horus-blue rounded-full" 
                      style={{ width: `${(option.votes / options.reduce((sum, opt) => sum + opt.votes, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((option.votes / options.reduce((sum, opt) => sum + opt.votes, 0)) * 100)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* زر التصويت */}
        {!hasVoted && (
          <button 
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
            onClick={handleVote}
            disabled={!selectedOption}
          >
            تصويت
          </button>
        )}
      </div>
    </div>
  );
};

export default PollWidget;
