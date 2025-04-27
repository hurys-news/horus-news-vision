import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface Match {
  id: string;
  time: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'upcoming' | 'live' | 'finished';
  homeFlag: string;
  awayFlag: string;
}

const TodayMatches = () => {
  const [matches] = useState<Match[]>([
    {
      id: '1',
      time: '19:00',
      league: 'المصري',
      homeTeam: 'الأهلي',
      awayTeam: 'الزمالك',
      homeScore: 1,
      awayScore: 1,
      status: 'upcoming',
      homeFlag: '🇪🇬',
      awayFlag: '🇪🇬'
    },
    {
      id: '2',
      time: 'مباشر',
      league: 'الإنجليزي',
      homeTeam: 'ليفربول',
      awayTeam: 'توتنهام',
      homeScore: 1038,
      awayScore: 1144,
      status: 'live',
      homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
    },
    {
      id: '3',
      time: '19:00',
      league: 'الإسباني',
      homeTeam: 'أوساسونا',
      awayTeam: 'إشبيلية',
      homeScore: 1,
      awayScore: 1,
      status: 'upcoming',
      homeFlag: '🇪🇸',
      awayFlag: '🇪🇸'
    },
    {
      id: '4',
      time: '21:00',
      league: 'الإيطالي',
      homeTeam: 'يوفنتوس',
      awayTeam: 'نابولي',
      homeScore: 0,
      awayScore: 1,
      status: 'upcoming',
      homeFlag: '🇮🇹',
      awayFlag: '🇮🇹'
    },
    {
      id: '5',
      time: '18:30',
      league: 'السعودي',
      homeTeam: 'الهلال',
      awayTeam: 'النصر',
      homeScore: 1,
      awayScore: 1,
      status: 'upcoming',
      homeFlag: '🇸🇦',
      awayFlag: '🇸🇦'
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* العنوان */}
      <div className="flex justify-between items-center">
        <h3 className="bg-horus-blue text-white px-4 py-1.5 text-sm font-bold">مباريات اليوم</h3>
        <button className="text-gray-400 hover:text-gray-600 p-2">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* قائمة المباريات */}
      <div className="p-2">
        {matches.map((match) => (
          <div key={match.id} className="mb-2 last:mb-0">
            {/* اسم الدوري */}
            <div className="flex justify-end items-center mb-1">
              <span className="text-xs text-gray-600">{match.league}</span>
              <span className="mr-1">{match.league === 'المصري' ? '🇪🇬' : match.league === 'الإنجليزي' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : match.league === 'الإسباني' ? '🇪🇸' : match.league === 'الإيطالي' ? '🇮🇹' : '🇸🇦'}</span>
            </div>

            {/* تفاصيل المباراة */}
            <div className={`rounded-lg p-2 ${match.status === 'live' ? 'bg-pink-100' : match.time === '19:00' ? 'bg-green-50' : match.time === '21:00' ? 'bg-green-50' : 'bg-green-50'}`}>
              <div className="flex justify-between items-center">
                {/* الفريق الأول */}
                <div className="flex items-center">
                  <span className="text-sm font-medium">{match.homeTeam}</span>
                  <span className="mx-1">{match.homeScore}</span>
                </div>

                {/* مقابل */}
                <div className="flex items-center mx-2">
                  <span className="text-xs text-gray-500 mx-1">VS</span>
                </div>

                {/* الفريق الثاني */}
                <div className="flex items-center">
                  <span className="mx-1">{match.awayScore}</span>
                  <span className="text-sm font-medium">{match.awayTeam}</span>
                </div>
              </div>

              {/* وقت المباراة */}
              <div className="text-center mt-1">
                <span className={`text-xs ${match.status === 'live' ? 'bg-pink-500 text-white px-2 py-0.5 rounded' : 'text-gray-500'}`}>
                  {match.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-400 mt-3 text-center">
          مصدر البيانات: API كورة • آخر تحديث: 04:45
        </div>
      </div>
    </div>
  );
};

export default TodayMatches;
