import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate();
  return (
    <div className='page'>
        <nav className='homenav'>
          <div className='nav-container'>
            <div className='header'>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                <path d="M3 12A9 3 0 0 0 21 12"></path>
                <path d="M9 17h6"></path>
              </svg>
              CipherSQLStudio
            </div>
            <div className='nav-links'>
                <Link to='/curriculum'>Curriculum</Link>
                <Link to='/practice'>Practice</Link>
                <Link to='/pricing'>Pricing</Link>
            </div>
            <div className='auth-links'>
                <Link to='/login'>Login</Link>
                <Link to='/signup'>Sign Up</Link>
            </div>
          </div>
        </nav>

        <div className='hero'>
          <h1>Learn SQL by <span>building real queries</span></h1>
          <h3>Master database querying skills with hands-on practice</h3>
          <div className='hero-buttons'>
            <button className='cta-button' onClick={()=>navigate("/signup")}>SignUp for free</button>
            <button className='secondary-button' onClick={()=>navigate("/login")}>Log In</button>
          </div>

          {/* Interactive SQL Editor Mockup */}
          <div className="editor-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="mockup-tab">query.sql</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="sidebar-title">TABLES</div>
                <div className="sidebar-item active">users</div>
                <div className="sidebar-item">orders</div>
                <div className="sidebar-item">products</div>
              </div>
              <div className="mockup-editor-content">
                <div className="code-line"><span className="keyword">SELECT</span> u.id, u.username, <span className="function">COUNT</span>(o.id) <span className="keyword">AS</span> total_orders</div>
                <div className="code-line"><span className="keyword">FROM</span> users u</div>
                <div className="code-line"><span className="keyword">LEFT JOIN</span> orders o <span className="keyword">ON</span> u.id = o.user_id</div>
                <div className="code-line"><span className="keyword">WHERE</span> u.status = <span className="string">'active'</span></div>
                <div className="code-line"><span className="keyword">GROUP BY</span> u.id</div>
                <div className="code-line"><span className="keyword">ORDER BY</span> total_orders <span className="keyword">DESC</span></div>
                <div className="code-line"><span className="keyword">LIMIT</span> <span className="number">3</span>;</div>
                
                <div className="mockup-action-row">
                  <span className="execution-time">Query executed in 0.04s</span>
                  <button className="mockup-run-btn" disabled>Run Query</button>
                </div>

                <div className="mockup-results">
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>username</th>
                        <th>total_orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1042</td>
                        <td>alex_dev</td>
                        <td>18</td>
                      </tr>
                      <tr>
                        <td>2091</td>
                        <td>sql_master</td>
                        <td>15</td>
                      </tr>
                      <tr>
                        <td>1104</td>
                        <td>jane_doe</td>
                        <td>12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className='cards'>
            <div className='card'>
                <div className='card-icon'>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2>Interactive Practice</h2>
                <p>Practice using our interactive SQL editor with real-time feedback.</p>
            </div>
            <div className='card'>
                <div className='card-icon'>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h2>Guided Lessons</h2>
                <p>Learn SQL concepts guided by our AI assistant.</p>
            </div>
            <div className='card'>
                <div className='card-icon'>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h2>Progress Tracking</h2>
                <p>Track your learning progress and achievements with our built-in analytics.</p>
            </div>
        </div>


        <footer>
            <p>&copy; 2024 CipherSQL. All rights reserved.</p>
        </footer>
        
    </div>
  )
}
