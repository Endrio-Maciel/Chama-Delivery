import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderStatus } from '../enums/order-status.enum';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(
        private jwtService: JwtService
    ) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        this.server = server;
        console.log("✅ WebSocket Server Inicializado!");
    }
    
    handleConnection(client: Socket) {
        const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(" ")[1];

        console.log("🔑 Token recebido:", token); 
        console.log("🔥 JWT_SECRET carregado no Gateway:", this.jwtService['options']?.secret);

        if (!token) {
            console.error("❌ Token JWT não foi enviado!");
            client.disconnect();
            return;
        }

        try {
            const decoded = this.jwtService.verify(token);
            console.log(`✅ Cliente autenticado: ${decoded.sub}`);
        } catch (error) {
            console.error("❌ Erro ao verificar JWT:", error.message);
            client.disconnect();
        }
    }
    
    handleDisconnect(client: Socket) {
        console.log(`❌ Cliente desconectado: ${client.id}`);
    }

    sendNewOrderNotification(restaurantId: string, order: any) {
        console.log(`📢 Enviando notificação para o restaurante ${restaurantId}`);

        if (!this.server) {
            console.error("❌ Servidor WebSocket não inicializado!");
            return;
        }

        const room = `restaurant-${restaurantId}`;
        console.log(`📤 Enviando para sala: ${room}`);

        this.server.to(room).emit('newOrder', order);
    }

    sendOrderStatusUpdate(orderId: string, status: OrderStatus) {
        console.log(`📤 Enviando status atualizado para sala: order-${orderId}`);
        console.log(`🔄 Pedido: ${orderId} | Novo status: ${status}`);

        this.server.to(`order-${orderId}`).emit('orderStatusUpdated', { orderId, status });
    }

    @SubscribeMessage('joinRestaurantRoom')
    handleJoinRestaurantRoom(client: Socket, data: { restaurantId: string }) {
        if (!data || !data.restaurantId) {
            console.error("❌ Erro: Dados inválidos recebidos no joinRestaurantRoom:", data);
            return;
        }
    
        const room = `restaurant-${data.restaurantId}`;
        client.join(room);
        console.log(`✅ Cliente ${client.id} entrou na sala: ${room}`);
        console.log(`📌 Salas do cliente agora:`, client.rooms);
    }

    @SubscribeMessage('joinOrderRoom')
    handleJoinOrderRoom(client: Socket, data: { orderId: string}) {
        if (!data || !data.orderId) {
            console.error("❌ Erro: Dados inválidos recebidos no joinOrderRoom:", data);
            return;
        }
        const room = `order-${data.orderId}`;
        client.join(room);
        console.log(`✅ Cliente ${client.id} entrou na sala do pedido: ${room}`);
        console.log(`📌 Salas do cliente agora:`, client.rooms)
    }
}
