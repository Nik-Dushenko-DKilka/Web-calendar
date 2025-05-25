import sqlite3

def init():
    conn = sqlite3.connect('events.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        time TEXT NOT NULL,
        allDay BOOLEAN NOT NULL,
        calendar TEXT NOT NULL,
        description TEXT,
        is_new BOOLEAN NOT NULL DEFAULT TRUE
    )
    ''')
    conn.commit()
    conn.close()

def save_event(user_data):
    conn = sqlite3.connect('events.db')
    cursor = conn.cursor()
    print(user_data)
    cursor.execute('''
    INSERT INTO events (title, description, time, allDay, calendar)
    VALUES (?, ?, ?, ?, ?)
    ''', (
        user_data['title'],
        user_data['description'],
        user_data['time'],
        user_data['allDay'],
        user_data['calendar']
    ))

    conn.commit()
    conn.close()


def get_events():
    result = []
    conn = sqlite3.connect('events.db')
    cursor = conn.cursor()
    events = cursor.execute('SELECT * FROM events').fetchall()
    for event in events:
        result.append(
            {
                'title': event[1],
                'time': event[2],
                'allDay': event[3],
                'calendar': event[4],
                'description': event[5],
                'is_new': event[6],
            }
        )
        cursor.execute('UPDATE events SET is_new = FALSE WHERE id = ?', (event[0],))
    conn.commit()
    return result



init()
