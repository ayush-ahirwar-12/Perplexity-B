class IChatRepository {
    async generateChatResponse(UserId, title) {
        throw new Error('Method not implemented');
    }
    async generateUserMessage(chatId, content) {
        throw new Error('Method not implemented');
    }
    async generateMessageResponse(chatId, content) {
        throw new Error('Method not implemented');
    }
    async getAllMessagesByChatId(chatId) {
        throw new Error('Method not implemented');
    }
    async getAllChatsOfUser(userId) {
        throw new Error('Method not implemented');
    }
}

export default IChatRepository;