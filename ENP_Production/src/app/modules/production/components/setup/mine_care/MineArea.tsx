import { SetupComponent } from '../DynamicComponent';

const MineArea = () => {
    const data = {
        url: 'ProductionMineArea',
        title: 'Mine Area',
      }
    
      return (
        <SetupComponent data={data} hasDescription={false} hasDuration={false} />
      )
}

export { MineArea };

