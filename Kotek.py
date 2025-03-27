import telebot
from datetime import datetime
import sqlite3

TOKEN = '7335845412:AAHPzuLbY06TIvch1VJBX0D8WhTYhVQKuss'
bot = telebot.TeleBot(TOKEN)

def init_db():
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS reservations
                 (user_id INTEGER, name TEXT, date TEXT, time TEXT, 
                  guests INTEGER, table_number INTEGER)''')
    conn.commit()
    conn.close()

user_states = {}

@bot.message_handler(commands=['start'])
def start(message):
    bot.reply_to(message, 
        "Добро пожаловать в TishUp!\n"
        "Для начала бронирования введите /book")

@bot.message_handler(commands=['book'])
def book(message):
    user_states[message.chat.id] = {'step': 'waiting_name'}
    bot.reply_to(message, "Введите ваше имя:")

@bot.message_handler(func=lambda message: True)
def handle_booking(message):
    user_id = message.chat.id
    
    if user_id not in user_states:
        bot.reply_to(message, "Для начала бронирования введите /book")
        return

    state = user_states[user_id]
    
    if state['step'] == 'waiting_name':
        state['name'] = message.text
        state['step'] = 'waiting_date'
        bot.reply_to(message, "Введите дату бронирования:")
    
    elif state['step'] == 'waiting_date':
        try:
            date = datetime.strptime(message.text, '%d.%m.%Y')
            state['date'] = message.text
            state['step'] = 'waiting_time'
            bot.reply_to(message, "Введите время:")
        except ValueError:
            bot.reply_to(message, "Неверный формат даты. Попробуйте снова (ДД.ММ.ГГГГ):")
    
    elif state['step'] == 'waiting_time':
        try:
            time = datetime.strptime(message.text, '%H:%M')
            state['time'] = message.text
            state['step'] = 'waiting_guests'
            bot.reply_to(message, "Введите количество гостей:")
        except ValueError:
            bot.reply_to(message, "Неверный формат времени. Попробуйте снова (ЧЧ:ММ):")
    
    elif state['step'] == 'waiting_guests':
        try:
            guests = int(message.text)
            if guests < 1 or guests > 8:
                bot.reply_to(message, "Количество гостей должно быть от 1 до 8. Попробуйте снова:")
                return
            
            table_number = guests // 2 + 1
            
            conn = sqlite3.connect('restaurant.db')
            c = conn.cursor()
            c.execute("INSERT INTO reservations VALUES (?, ?, ?, ?, ?, ?)",
                     (user_id, state['name'], state['date'], state['time'], 
                      guests, table_number))
            conn.commit()
            conn.close()
            
            confirmation = (
                f"Бронирование подтверждено!\n"
                f"Имя: {state['name']}\n"
                f"Дата: {state['date']}\n"
                f"Время: {state['time']}\n"
                f"Количество гостей: {guests}\n"
                f"Номер стола: {table_number}"
            )
            bot.reply_to(message, confirmation)
            
            del user_states[user_id]
            
        except ValueError:
            bot.reply_to(message, "Пожалуйста, введите число. Попробуйте снова:")

if __name__ == '__main__':
    init_db()
    bot.polling(none_stop=True)
