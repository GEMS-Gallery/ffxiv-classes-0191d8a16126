export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Class = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'role' : IDL.Text,
    'description' : IDL.Text,
    'image' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : Class, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'addClass' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'dislikeClass' : IDL.Func([IDL.Text], [Result], []),
    'getClassDetails' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getClasses' : IDL.Func([], [IDL.Vec(Class)], ['query']),
    'getLikesDislikes' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'likeClass' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
