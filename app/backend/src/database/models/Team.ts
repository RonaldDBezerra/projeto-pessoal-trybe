import { Model, DataTypes } from 'sequelize';
import db from '.';

class Team extends Model {
  public id!: number;

  public teamName!: string;
}
Team.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'team_name',
  },
}, {
  sequelize: db,
  modelName: 'team',
  timestamps: false,
});

export default Team;
