const { Course, Module, ShelterLocation, Alert, Drill, Resource } = require('../../src/models/mysql/index');

const seedData = async () => {
  const existingCourses = await Course.count();
  if (existingCourses > 0) {
    console.log('⏭️  Database already seeded, skipping...');
    return;
  }
  console.log('🌱 Seeding database...');

  await Course.bulkCreate([
    { title: 'Fundamentals of Disaster Preparedness', description: 'Learn the basics of preparing for natural disasters.', level: 'beginner', category: 'General', duration_mins: 150, has_certificate: true },
    { title: 'Emergency First Aid & CPR', description: 'Essential first aid skills for emergency situations.', level: 'intermediate', category: 'Medical', duration_mins: 240, has_certificate: true },
    { title: 'Hazard Risk Assessment', description: 'Learn to identify and assess disaster risks.', level: 'intermediate', category: 'Assessment', duration_mins: 180, has_certificate: true },
    { title: 'Crisis Communication Skills', description: 'Effective communication during emergencies.', level: 'beginner', category: 'Communication', duration_mins: 105, has_certificate: false },
    { title: 'Search & Rescue Basics', description: 'Introduction to search and rescue operations.', level: 'advanced', category: 'Operations', duration_mins: 300, has_certificate: true },
  ]);

  await Module.bulkCreate([
    { course_id: 1, title: 'What is Disaster Preparedness?', content: 'Introduction to disaster preparedness concepts.', duration_mins: 12, order_num: 1 },
    { course_id: 1, title: 'Types of Natural Disasters', content: 'Overview of floods, earthquakes, cyclones, and more.', duration_mins: 18, order_num: 2 },
    { course_id: 1, title: 'Building an Emergency Kit', content: 'Essential items for your emergency kit.', duration_mins: 20, order_num: 3 },
    { course_id: 1, title: 'Evacuation Planning', content: 'How to plan and execute an evacuation.', duration_mins: 22, order_num: 4 },
    { course_id: 1, title: 'Communication During Crisis', content: 'Staying connected during emergencies.', duration_mins: 15, order_num: 5 },
    { course_id: 1, title: 'First Aid Fundamentals', content: 'Basic first aid techniques.', duration_mins: 30, order_num: 6 },
    { course_id: 1, title: 'Shelter-in-Place Protocols', content: 'When and how to shelter in place.', duration_mins: 18, order_num: 7 },
    { course_id: 1, title: 'Recovery & Mental Health', content: 'Post-disaster recovery and mental wellness.', duration_mins: 16, order_num: 8 },
  ]);

  await Alert.bulkCreate([
    { title: 'Flood Warning — Zone B', level: 'critical', message: 'Heavy rainfall forecast. Pre-evacuate low-lying areas immediately.', target_group: 'all', is_active: true },
    { title: 'Fire Drill Reminder', level: 'warning', message: 'Scheduled fire drill for Main Block A on March 12 at 10:00 AM.', target_group: 'all', is_active: true },
    { title: 'New Resource Added', level: 'info', message: 'Updated 2026 Cyclone Preparedness Handbook is now available.', target_group: 'all', is_active: true },
  ]);

  await Drill.bulkCreate([
    { type: 'Fire Evacuation',   date: '2026-03-12', building: 'Main Block A',  participants: 320,  status: 'scheduled' },
    { type: 'Earthquake Drill',  date: '2026-03-18', building: 'Science Wing',  participants: 145,  status: 'scheduled' },
    { type: 'Flood Evacuation',  date: '2026-02-28', building: 'Campus-Wide',   participants: 1240, status: 'completed' },
    { type: 'Cyclone Shelter-In',date: '2026-04-05', building: 'All Buildings', participants: 1500, status: 'planned'   },
  ]);

  await ShelterLocation.bulkCreate([
    { name: 'Government High School Shelter', address: 'MG Road, Bengaluru',      latitude: 12.9716, longitude: 77.5946, capacity: 500, type: 'general',    contact: '080-12345678' },
    { name: 'Community Flood Relief Center',  address: 'Whitefield, Bengaluru',   latitude: 12.9698, longitude: 77.7499, capacity: 300, type: 'flood',      contact: '080-87654321' },
    { name: 'District Earthquake Response Hub',address:'Jayanagar, Bengaluru',    latitude: 12.9250, longitude: 77.5938, capacity: 800, type: 'earthquake', contact: '080-11223344' },
  ]);

  await Resource.bulkCreate([
    { title: 'Emergency Evacuation Maps',      description: 'Campus evacuation route maps.',          file_type: 'PDF',   category: 'Planning',   icon: '📋' },
    { title: 'CPR Training Guide',             description: 'Step-by-step CPR instructions.',         file_type: 'PDF',   category: 'First Aid',  icon: '🏥' },
    { title: 'Risk Assessment Template',       description: 'Template for assessing disaster risks.', file_type: 'Excel', category: 'Assessment', icon: '📊' },
    { title: 'Disaster Preparedness Handbook', description: 'Comprehensive guide for all disasters.', file_type: 'PDF',   category: 'Guide',      icon: '📖' },
    { title: 'Emergency Communication Guide',  description: 'How to communicate during crises.',      file_type: 'PDF',   category: 'Comms',      icon: '📻' },
  ]);

  console.log('✅ Database seeded successfully!');
};

module.exports = seedData;
