from telegram import Update
from telegram.ext import CommandHandler, MessageHandler, ConversationHandler, Application, CallbackContext
from telegram.ext import filters
from datetime import datetime

import db

TOKEN = '8007747642:AAGSonSG8zpVrdezyTc6ZahRLwUA9xcdqD8'

async def start(update: Update, context: CallbackContext):
    await update.message.reply_text("Привіт! Щоб створити нову подію, надішли команду /create_event.")
    return ConversationHandler.END

async def create_event(update: Update, context: CallbackContext):
    await update.message.reply_text("Будь ласка, введи назву події:")
    return "title"

async def get_title(update: Update, context: CallbackContext):
    context.user_data['title'] = update.message.text
    await update.message.reply_text("Введи опис події:")
    return "description"

async def get_description(update: Update, context: CallbackContext):
    context.user_data['description'] = update.message.text
    await update.message.reply_text("Введи дату та час події (формат: YYYY-MM-DD HH:MM):")
    return "time"

async def get_time(update: Update, context: CallbackContext):
    try:
        datetime.strptime(update.message.text, "%Y-%m-%d %H:%M")
        context.user_data['time'] = update.message.text
        await update.message.reply_text("Чи подія буде на весь день? (Так/Ні):")
        return "allDay"
    except ValueError:
        await update.message.reply_text("Некоректний формат часу. Повторіть спробу (формат: YYYY-MM-DD HH:MM):")
        return 'time'


async def get_all_day(update: Update, context: CallbackContext):
    all_day_response = update.message.text.lower()
    if all_day_response == 'так':
        context.user_data['allDay'] = True
        await update.message.reply_text("Введи календар, до якого відноситься подія:")
        return 'calendar'
    context.user_data['allDay'] = False
    await update.message.reply_text("Введи дату та час закінчення події (формат: YYYY-MM-DD HH:MM):")
    return 'end_time'


async def get_end_time(update: Update, context: CallbackContext):
    try:
        datetime.strptime(update.message.text, "%Y-%m-%d %H:%M")
        context.user_data['time'] += f'|{update.message.text}'
        await update.message.reply_text("Введи календар, до якого відноситься подія:")
        return 'calendar'
    except ValueError:
        await update.message.reply_text("Некоректний формат часу. Повторіть спробу (формат: YYYY-MM-DD HH:MM):")
        return 'end_time'
    

async def get_calendar(update: Update, context: CallbackContext):
    context.user_data['calendar'] = update.message.text
    await update.message.reply_text("Подія створена! Тепер збережемо її в базі даних.")
    
    db.save_event(context.user_data)

    return ConversationHandler.END



async def cancel(update: Update, context: CallbackContext):
    await update.message.reply_text("Створення події скасовано.")
    return ConversationHandler.END

def main():
    db.init()
    application = Application.builder().token(TOKEN).build()

    conversation_handler = ConversationHandler(
        entry_points=[CommandHandler('create_event', create_event)],
        states={
            'title': [MessageHandler(filters.TEXT & ~filters.COMMAND, get_title)],  # Оновлений фільтр
            'description': [MessageHandler(filters.TEXT & ~filters.COMMAND, get_description)],  # Оновлений фільтр
            'time': [MessageHandler(filters.TEXT & ~filters.COMMAND, get_time)],  # Оновлений фільтр
            'allDay': [MessageHandler(filters.TEXT & ~filters.COMMAND, get_all_day)],  # Оновлений фільтр
            'calendar': [MessageHandler(filters.TEXT & ~filters.COMMAND, get_calendar)],  # Оновлений фільтр
            'end_time': [MessageHandler(filters.TEXT & ~filters.COMMAND, get_end_time)],
        },
        fallbacks=[CommandHandler('cancel', cancel)]
    )

    application.add_handler(CommandHandler('start', start))
    application.add_handler(conversation_handler)

    application.run_polling()

if __name__ == '__main__':
    main()
