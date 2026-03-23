class IChatRepository {
    async generateChatResponse(UserId, title) {
        throw new Error('Method not implemented');
    }
    async generateMessageResponse(chatId, content) {
        throw new Error('Method not implemented');
    }
}

export default IChatRepository;
