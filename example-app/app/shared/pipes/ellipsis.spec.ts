import { EllipsisPipe } from './ellipsis';

describe('Pipe: Ellipsis', () => {
  let pipe: EllipsisPipe;
  const longStr = `Lorem ipsum dolor sit amet,
  consectetur adipisicing elit. Quibusdam ab similique, odio sit
  harum laborum rem, nesciunt atque iure a pariatur nam nihil dolore necessitatibus quos ea autem accusantium dolor
  voluptates voluptatibus. Doloribus libero, facilis ea nam
  quibusdam aut labore itaque aliquid, optio. Rerum, dolorum!
  Error ratione tempore nesciunt magnam reprehenderit earum
  tempora aliquam laborum consectetur repellendus, nam hic
  maiores, qui corrupti saepe possimus, velit impedit eveniet
  totam. Aliquid qui corrupti facere. Alias itaque pariatur
  aliquam, nemo praesentium. Iure delectus, nemo natus! Libero
  ducimus aspernatur laborum voluptatibus officiis eaque enim
  minus accusamus, harum facilis sed eum! Sit vero vitae
  voluptatibus deleniti, corporis deserunt? Optio reprehenderit
  quae nesciunt minus at, sint fuga impedit, laborum praesentium
  illo nisi natus quia illum obcaecati id error suscipit eaque!
  Sed quam, ab dolorum qui sit dolorem fuga laudantium est,
  voluptas sequi consequuntur dolores animi veritatis doloremque
  at placeat maxime suscipit provident? Mollitia deserunt
  repudiandae illo. Similique voluptatem repudiandae possimus
  veritatis amet incidunt alias, debitis eveniet voluptate
  magnam consequatur eum molestiae provident est dicta. A autem
  praesentium voluptas, quis itaque doloremque quidem debitis?
  Ex qui, corporis voluptatibus assumenda necessitatibus
  accusamus earum rem cum quidem quasi! Porro assumenda, modi.
  Voluptatibus enim dignissimos fugit voluptas hic ducimus ullam,
  minus. Soluta architecto ratione, accusamus vitae eligendi
  explicabo beatae reprehenderit. Officiis voluptatibus
  dignissimos cum magni! Deleniti fuga reiciendis, ab dicta
  quasi impedit voluptatibus earum ratione inventore cum
  voluptas eligendi vel ut tenetur numquam, alias praesentium
  iusto asperiores, ipsa. Odit a ea, quaerat culpa dolore
  veritatis mollitia veniam quidem, velit, natus sint at.`;

  beforeEach(() => {
    pipe = new EllipsisPipe();
  });

  it('should return the string if it\'s length is less than 250', () => {
    expect(pipe.transform('string')).toEqual('string');
  });

  it('should return up to 250 characters followed by an ellipsis', () => {
    expect(pipe.transform(longStr)).toEqual(`${longStr.substr(0, 250)}...`);
  });

  it('should return only 20 characters followed by an ellipsis', () => {
    expect(pipe.transform(longStr, 20)).toEqual(`${longStr.substr(0, 20)}...`);
  });
});
