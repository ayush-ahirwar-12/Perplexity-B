class IAuthRepository {
  async createUser(data) {
    throw new Error("Method not Implemented");
  };
  async findUserbyEmail(email) {
    throw new Error("method not implemented");
  };
  async findUserbyId(id) {
    throw new Error("method not implemented");
  };
  async update(userId,newData){
    throw new Error("method not implemented");
  };
};

export default IAuthRepository
