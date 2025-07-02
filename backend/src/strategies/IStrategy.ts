export default interface IStrategy<T> {
    executar(...args: any[]): Promise<any>;
} 