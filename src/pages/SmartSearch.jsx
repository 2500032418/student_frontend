import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { contextualSearch, semanticSearch } from '../services/api';

function SmartSearch() {
  // Role guard: Students cannot access this page
  const userRole = localStorage.getItem('userRole') || '1';
  if (userRole === '2') {
    return <Navigate to="/" replace />;
  }

  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('keyword'); // 'keyword' or 'semantic'
  const [results, setResults] = useState(null);
  const [vectorResults, setVectorResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      if (searchMode === 'keyword') {
        // PostgreSQL keyword search (existing)
        const res = await contextualSearch(query);
        if (res.code === 200) {
          setResults(res.data);
        }
      } else {
        // MongoDB Vector Search (semantic)
        const res = await semanticSearch(query);
        if (res.code === 200) {
          setVectorResults(res);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Smart Search</h1>
          <p>Contextual search with intelligent insights across the system</p>
        </div>
      </div>

      <div className="search-hero">
        {/* Search Mode Toggle */}
        <div className="search-mode-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            className={`btn ${searchMode === 'keyword' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSearchMode('keyword')}
            style={{ fontSize: '13px', padding: '6px 16px' }}
          >
            🔍 Keyword Search
          </button>
          <button
            className={`btn ${searchMode === 'semantic' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSearchMode('semantic')}
            style={{ fontSize: '13px', padding: '6px 16px' }}
          >
            Semantic Search (Vector)
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form-large">
          <div className="search-input-wrapper">
            <span className="search-icon">{searchMode === 'semantic' ? '✨' : '🔍'}</span>
            <input
              type="text"
              placeholder={
                searchMode === 'semantic'
                  ? 'Try: "Students weak in mathematics", "Top performing students in semester"...'
                  : 'Try: "students with low attendance", "top performers", "course statistics"...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input-lg"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="search-tips">
          <span>Try: </span>
          {searchMode === 'semantic' ? (
            <>
              <button className="tip-btn" onClick={() => setQuery('Students weak in mathematics')}>weak in math</button>
              <button className="tip-btn" onClick={() => setQuery('Top performing students in semester')}>top performers</button>
              <button className="tip-btn" onClick={() => setQuery('Students with poor attendance')}>poor attendance</button>
              <button className="tip-btn" onClick={() => setQuery('Best computer science students')}>best CS students</button>
            </>
          ) : (
            <>
              <button className="tip-btn" onClick={() => setQuery('students with low attendance')}>low attendance</button>
              <button className="tip-btn" onClick={() => setQuery('top performing students')}>top performers</button>
              <button className="tip-btn" onClick={() => setQuery('course statistics')}>course stats</button>
              <button className="tip-btn" onClick={() => setQuery('grade summary')}>grade summary</button>
              <button className="tip-btn" onClick={() => setQuery('system overview')}>overview</button>
            </>
          )}
        </div>
      </div>

      {loading && <div className="page-loading">Analyzing your query...</div>}

      {/* Semantic Search Results (Vector Search) */}
      {vectorResults && !loading && searchMode === 'semantic' && (
        <div className="search-results">
          <div className="result-section">
            <h2>Semantic Search Results</h2>
            {vectorResults.count > 0 ? (
              <div className="result-grid">
                {vectorResults.matches?.map((m, idx) => (
                  <div key={idx} className="result-card">
                    <strong>{m.studentName || 'Unknown'}</strong>
                    <span className="text-muted">{m.email || ''}</span>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {m.text ? m.text.substring(0, 100) + '...' : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No semantically matching results found. Make sure the vector search index is created in Atlas and student embeddings have been populated.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyword Search Results (existing PostgreSQL search) */}
      {results && !loading && searchMode === 'keyword' && (
        <div className="search-results">
          {results.students?.length > 0 && (
            <div className="result-section">
              <h2>Students ({results.students.length})</h2>
              <div className="result-grid">
                {results.students.map((s) => (
                  <div key={s.id} className="result-card">
                    <strong>{s.firstName} {s.lastName}</strong>
                    <span className="text-muted">{s.studentId}</span>
                    <span className="text-muted">{s.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.courses?.length > 0 && (
            <div className="result-section">
              <h2>Courses ({results.courses.length})</h2>
              <div className="result-grid">
                {results.courses.map((c) => (
                  <div key={c.id} className="result-card">
                    <strong>{c.name}</strong>
                    <span className="text-muted">{c.code}</span>
                    <span className="text-muted">{c.credits} Credits</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.insights?.length > 0 && (
            <div className="result-section">
              <h2>Intelligent Insights</h2>
              {results.insights.map((insight, idx) => (
                <div key={idx} className="insight-card">
                  <div className="insight-header">
                    <span className="insight-icon">
                      {insight.type === 'attendance_warning' ? '⚠️' :
                       insight.type === 'top_performers' ? '🏆' :
                       insight.type === 'course_stats' ? '📊' :
                       insight.type === 'performance_overview' ? '📈' :
                       insight.type === 'summary_stats' ? '📋' : '💡'}
                    </span>
                    <h3>{insight.title}</h3>
                  </div>

                  {insight.type === 'attendance_warning' && insight.data?.length > 0 && (
                    <div className="insight-table">
                      {insight.data.map((item, i) => (
                        <div key={i} className="insight-row">
                          <span>{item.student?.firstName} {item.student?.lastName}</span>
                          <span className="text-warning">{item.attendancePercentage}%</span>
                          <span className="text-muted">{item.insight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.type === 'top_performers' && insight.data?.length > 0 && (
                    <div className="insight-table">
                      {insight.data.map((item, i) => (
                        <div key={i} className="insight-row">
                          <span className="rank-badge">#{item.rank}</span>
                          <span>{item.student?.firstName} {item.student?.lastName}</span>
                          <span className="text-success">{item.averagePercentage}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.type === 'course_stats' && insight.data?.length > 0 && (
                    <div className="insight-table">
                      {insight.data.map((item, i) => (
                        <div key={i} className="insight-row">
                          <span>{item.course?.name}</span>
                          <span className="text-muted">{item.course?.code}</span>
                          <span className="text-primary">{item.enrolledStudents} enrolled</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.type === 'performance_overview' && insight.data?.length > 0 && (
                    <div className="insight-table">
                      {insight.data.map((item, i) => (
                        <div key={i} className="insight-row">
                          <span>{item.student?.firstName} {item.student?.lastName}</span>
                          <span className={`${item.averagePercentage >= 80 ? 'text-success' : item.averagePercentage >= 60 ? 'text-warning' : 'text-danger'}`}>
                            {item.averagePercentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.type === 'summary_stats' && insight.data && (
                    <div className="stats-mini-grid">
                      <div className="stat-mini">
                        <span className="stat-mini-value">{insight.data.totalStudents}</span>
                        <span>Total Students</span>
                      </div>
                      <div className="stat-mini">
                        <span className="stat-mini-value">{insight.data.activeStudents}</span>
                        <span>Active</span>
                      </div>
                      <div className="stat-mini">
                        <span className="stat-mini-value">{insight.data.totalCourses}</span>
                        <span>Courses</span>
                      </div>
                      <div className="stat-mini">
                        <span className="stat-mini-value">{insight.data.totalEnrollments}</span>
                        <span>Enrollments</span>
                      </div>
                    </div>
                  )}

                  {insight.type === 'student_match' && insight.data?.length > 0 && (
                    <div className="insight-table">
                      {insight.data.map((s, i) => (
                        <div key={i} className="insight-row">
                          <span>{s.firstName} {s.lastName}</span>
                          <span className="text-muted">{s.studentId}</span>
                          <span className="text-muted">{s.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!results.students?.length && !results.courses?.length && !results.insights?.length && searched && (
            <div className="no-results">
              <p>No results found for "{query}". Try different search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SmartSearch;
