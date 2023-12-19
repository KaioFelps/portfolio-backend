import { Aggregate } from '../entities/aggregate';
import { EntityUniqueId } from '../entities/entity-unique-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregate extends Aggregate<unknown> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreatedEvent(aggregate));

    return aggregate;
  }
}

class CustomAggregateCreatedEvent implements DomainEvent {
  public ocurredAt: Date = new Date();
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
  }

  getAggregateId(): EntityUniqueId {
    return this.aggregate.id;
  }
}

describe('Domain events', () => {
  test('if it can dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    /* SUBSCRIBER CADASTRADO (ouvindo o evento de resposta criada)
     * registra um subscriber, faz "ouvi-lo"
     * parametros: função a ser executada, evento que dispara a função
     */

    DomainEvents.registerAggregateEvent(
      callbackSpy,
      CustomAggregateCreatedEvent.name,
    );

    // cria uma resposta, mas SEM salvar no banco de dados
    const aggregate = CustomAggregate.create();

    // o evento não deve ter sido disparado ainda, pois não foi salvo no banco. Logo, deve ainda estar no domínio
    expect(aggregate.getDomainEvents()).toHaveLength(1);

    /* PUBLISHER CADASTRADO (disparou o evento de resposta criada) */
    DomainEvents.dispatchEventsForAggregate(aggregate.id); // essa linha chama a função callback do registro lá em cima

    // como o evento foi disparado, espera-se que o callback tenha sido chamado
    expect(callbackSpy).toHaveBeenCalled();

    // como o evento já foi disparado, espera-se que ele não esteja mais no domínio
    expect(aggregate.getDomainEvents()).toHaveLength(0);
  });
});
