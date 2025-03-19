import { Payment, PaymentMethod, PaymentStatus } from '@domain/models/payment.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface PaymentCreationAttributes extends Optional<Payment, 'id' | 'createdAt' | 'updatedAt'> {}

export class PaymentModel extends Model<Payment, PaymentCreationAttributes> implements Payment {
  public id!: number;
  public amount!: number;
  public currency!: string;
  public method!: PaymentMethod;
  public productId!: string;
  public paymentId!: string;
  public status!: PaymentStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PaymentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'product_id',
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'payment_id',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'payments',
    underscored: true,
  },
);
