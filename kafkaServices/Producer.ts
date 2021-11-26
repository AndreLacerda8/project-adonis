import { Kafka, Message } from 'kafkajs'

interface ProducerProps{
    topic: string,
    messages: Message[]
}

const kafka = new Kafka({
    clientId: 'lottery',
    brokers: ['localhost:9092']
})

export const Producer = async ({ topic, messages }: ProducerProps) => {
    const producer = await kafka.producer()
    await producer.connect()

    await producer.send({
        topic,
        messages
    })
    
    await producer.disconnect()
}