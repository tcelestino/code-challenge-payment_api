import { Payment, PaymentMethod, PaymentStatus } from '@domain/models/payment.model';
import { DataTypes, Model, Optional } from 'sequelize';

// Interface para criação de pagamento (alguns campos opcionais)
interface PaymentCreationAttributes extends Optional<Payment, 'id' | 'createdAt' | 'updatedAt'> {}

export class PaymentModel extends Model<Payment, PaymentCreationAttributes> implements Payment {
  public id!: number;
  public paymentId!: string;
  public amount!: number;
  public currency!: string;
  public method!: PaymentMethod;
  public status!: PaymentStatus;
  public productId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Método para simular conversão para JSON nos testes
  public toJSON(): Payment {
    return {
      id: this.id,
      paymentId: this.paymentId,
      amount: this.amount,
      currency: this.currency,
      method: this.method,
      status: this.status,
      productId: this.productId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Modelo Sequelize
export const initPaymentModel = (sequelize: any) => {
  PaymentModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'payments',
      timestamps: true,
    },
  );

  return PaymentModel;
};
