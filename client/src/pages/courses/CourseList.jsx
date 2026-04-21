import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const LEVEL_COLOR = { beginner: 'text-green-400 bg-green-400/10', intermediate: 'text-yellow-400 bg-yellow-400/10', advanced: 'text-red-400 bg-red-400/10' };
const CAT_ICON = { General: '🌍', Medical: '🏥', Assessment: '📊', Communication: '📻', Operations: '🔧' };

export default function CourseList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } });
      setCourses(res.data.data.courses);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const enroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling');
    }
    setEnrolling(null);
  };

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filtered = filter === 'All' ? courses : courses.filter(c => c.category === filter);
  // Deduplicate by title
  const seen = new Set();
  const unique = filtered.filter(c => { if (seen.has(c.title)) return false; seen.add(c.title); return true; });

  return (
    <Layout title="Course Modules">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Learn</p>
          <h2 className="text-white text-2xl font-bold">Disaster Preparedness Courses</h2>
          <p className="text-gray-400 text-sm mt-1">{unique.length} courses available</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === cat ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {unique.map(course => (
            <div key={course.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all group">
              {/* Card header */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 flex items-center justify-center text-5xl border-b border-gray-700">
                {CAT_ICON[course.category] || '📚'}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                  {course.has_certificate && <span className="text-xs px-2 py-0.5 rounded-full font-medium text-orange-400 bg-orange-400/10">🏅 Certificate</span>}
                </div>
                <h3 className="text-white font-bold mb-2 leading-tight">{course.title}</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>⏱ {course.duration_mins} min</span>
                  <span>📦 {course.modules?.length || 0} modules</span>
                </div>
                <button
                  onClick={() => enroll(course.id)}
                  disabled={enrolling === course.id}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors uppercase tracking-widest">
                  {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    
  );
}
