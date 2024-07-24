var _0x3e1e = [
  "\x73\x74\x61\x74\x65",
  "\x65\x6D\x61\x69\x6C",
  "\x70\x61\x73\x73\x77\x6F\x72\x64",
  "\x72\x6F\x6C\x65",
  "\x75\x73\x65\x72\x73",
  "\x65\x72\x72\x6F\x72",
  "\x6D\x65\x73\x73\x61\x67\x65",
  "\x65\x64\x69\x74\x4D\x6F\x64\x65",
  "\x73\x65\x74\x45\x6D\x61\x69\x6C",
  "\x73\x65\x74\x50\x61\x73\x73\x77\x6F\x72\x64",
  "\x73\x65\x74\x52\x6F\x6C\x65",
  "\x73\x65\x74\x45\x64\x69\x74\x4D\x6F\x64\x65",
  "\x73\x65\x74\x45\x64\x69\x74\x55\x73\x65\x72\x45\x6D\x61\x69\x6C",
  "\x6F\x70\x65\x6E",
  "\x6D\x6F\x64\x61\x6C\x56\x69\x73\x69\x62\x6C\x65",
  "\x73\x65\x74\x4D\x6F\x64\x61\x6C\x56\x69\x73\x69\x62\x6C\x65",
  "\x73\x68\x6F\x77\x50\x61\x73\x73\x77\x6F\x72\x64",
  "\x73\x65\x74\x53\x68\x6F\x77\x50\x61\x73\x73\x77\x6F\x72\x64",
  "\x66\x6F\x72\x6D",
  "\x6F\x6E\x46\x69\x6E\x69\x73\x68",
  "\x73\x75\x63\x63\x65\x73\x73\x46\x75\x6C\x6C\x4D\x65\x73\x73\x61\x67\x65",
  "\x69\x6E\x69\x74\x69\x61\x6C\x56\x61\x6C\x75\x65\x73",
  "\x69\x6E\x70\x75\x74",
  "\x76\x61\x6C\x75\x65",
  "\x6F\x6E\x43\x68\x61\x6E\x67\x65",
  "\x6F\x6E\x43\x61\x6E\x63\x65\x6C",
  "\x65\x72\x72\x6F\x72",
  "\x6C\x6F\x67",
  "\x74\x79\x70\x65",
  "\x70\x72\x69\x6D\x61\x72\x79",
  "\x75\x73\x65\x52\x6F\x6C\x65",
  "\x69\x6E\x66\x6F",
  "\x6C\x65\x6E\x67\x74\x68",
  "\x69\x73\x41\x64\x6D\x69\x6E",
  "\x69\x73\x45\x6D\x70\x6C\x6F\x79\x65\x65",
  "\x61\x64\x6D\x69\x6E",
  "\x73\x68\x6F\x72\x74\x43\x75\x74",
  "\x65\x6D\x70\x6C\x6F\x79\x65\x65",
  "\x6D\x69\x6E\x4C\x65\x6E\x67\x74\x68",
  "\x63\x6F\x6E\x74\x61\x63\x74\x4C\x65\x6E\x67\x74\x68",
  "\x73\x75\x63\x63\x65\x73\x73\x50\x61\x73\x73\x77\x6F\x72\x64",
  "\x75\x6E\x73\x75\x70\x70\x6F\x72\x74\x65\x64",
  "\x76\x61\x6C\x69\x64\x61\x74\x65\x45\x6D\x61\x69\x6C",
  "\x61\x64\x64\x4F\x72\x55\x70\x64\x61\x74\x65\x55\x73\x65\x72",
  "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x69\x6F\x2F",
];
import { Button, Form, Input, List, message, Modal, Select } from "antd";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
function Admin() {
  const [_0x1c1e, _0x1c1f] = useState("");
  const [_0x1c20, _0x1c21] = useState("");
  const [_0x1c22, _0x1c23] = useState("employee");
  const [_0x1c24, _0x1c25] = useState([]);
  const [_0x1c26, _0x1c27] = useState("");
  const [_0x1c28, _0x1c29] = useState("");
  const [_0x1c2a, _0x1c2b] = useState(false);
  const [_0x1c2c, _0x1c2d] = useState("");
  const [_0x1c2e, _0x1c2f] = useState(false);
  const [_0x1c30, _0x1c31] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const _0x1d1e = async () => {
      try {
        const _0x1d1f = getDatabase();
        const _0x1d20 = ref(_0x1d1f, _0x3e1e[4]);
        const _0x1d21 = await get(_0x1d20);
        const _0x1d22 = _0x1d21.val();
        if (_0x1d22) {
          _0x1c25(Object[_0x3e1e[23]](_0x1d22));
        }
      } catch (_0x1d23) {
        message[_0x3e1e[5]](_0x3e1e[6]);
      }
    };
    _0x1d1e();
  }, []);
  useEffect(() => {
    const _0x1d24 = JSON.parse(localStorage.getItem(_0x3e1e[5]));
    if (_0x1d24 && _0x1d24.role !== _0x3e1e[34]) {
      navigate(_0x3e1e[33]);
    }
  }, [navigate]);
  const _0x1d25 = async (_0x1d26) => {
    const { email: _0x1d27, password: _0x1d28, role: _0x1d29 } = _0x1d26;
    if (!_0x1d27 || !_0x1d28) {
      message[_0x3e1e[5]](_0x3e1e[27]);
      return;
    }
    if (!_0x3e1e[41][_0x3e1e[39]](_0x1d27)) {
      message[_0x3e1e[5]](_0x3e1e[28]);
      return;
    }
    if (_0x1d28[_0x3e1e[22]] < 6) {
      message[_0x3e1e[5]](_0x3e1e[29]);
      return;
    }
    try {
      const _0x1d2a = getDatabase();
      const _0x1d2b = ref(
        _0x1d2a,
        _0x3e1e[30] + _0x1d27.replace(_0x3e1e[31], _0x3e1e[32])
      );
      let _0x1d2c = {
        email: email,
        password: password,
        contact: _0x3e1e[0],
        cv_list: [
          {
            title: _0x3e1e[0],
            description: _0x3e1e[0],
            file: _0x3e1e[0],
            updatedAt: new Date().toISOString(),
          },
        ],
        role: role,
        createdAt: new Date().toISOString(),
        projetcIds: _0x3e1e[0],
        skill: _0x3e1e[0],
        Status: _0x3e1e[0],
      };
      if (editMode) {
        await update(_0x1d2b, _0x1d2c);
        message[_0x3e1e[7]](_0x3e1e[8]);
      } else {
        const _0x1d2d = await get(ref(_0x1d2a, _0x3e1e[4]));
        const _0x1d2e = _0x1d2d.val();
        const _0x1d2f = Object.values(_0x1d2e).filter(
          (_0x1d30) => _0x1d30.role === _0x3e1e[34]
        );
        if (role === _0x3e1e[34] && _0x1d2f[_0x3e1e[21]] === 0) {
          _0x1d2c[_0x3e1e[42]] = true;
        }
        await set(_0x1d2b, _0x1d2c);
        message[_0x3e1e[7]](_0x3e1e[35]);
      }
      _0x1c1f(_0x3e1e[0]);
      _0x1c21(_0x3e1e[0]);
      _0x1c23(_0x3e1e[34]);
      _0x1c2b(false);
      _0x1c2d(_0x3e1e[0]);
      const _0x1d31 = await get(ref(_0x1d2a, _0x3e1e[4]));
      const _0x1d32 = _0x1d31.val();
      if (_0x1d32) {
        _0x1c25(Object[_0x3e1e[23]](_0x1d32));
      }
    } catch (_0x1d33) {
      message[_0x3e1e[5]](_0x3e1e[6]);
    }
  };
  const _0x1d34 = async (_0x1d35) => {
    try {
      const _0x1d36 = getDatabase();
      const _0x1d37 = ref(
        _0x1d36,
        _0x3e1e[30] + _0x1d35.replace(_0x3e1e[31], _0x3e1e[32])
      );
      const _0x1d38 = await get(_0x1d37);
      const _0x1d39 = _0x1d38.val();
      const _0x1d3a = users.filter((_0x1d3b) => _0x1d3b.isAdmin);
      if (_0x1d39.isAdmin && _0x1d3a[_0x3e1e[21]] === 1) {
        message[_0x3e1e[5]](_0x3e1e[36]);
        return;
      }
      if (_0x1d39.isAdmin) {
        message[_0x3e1e[5]](_0x3e1e[37]);
        return;
      }
      await remove(_0x1d37);
      message[_0x3e1e[7]](_0x3e1e[38]);
      const _0x1d3c = await get(ref(_0x1d36, _0x3e1e[4]));
      const _0x1d3d = _0x1d3c.val();
      if (_0x1d3d) {
        _0x1c25(Object[_0x3e1e[23]](_0x1d3d));
      } else {
        _0x1c25([]);
      }
    } catch (_0x1d3e) {
      message[_0x3e1e[5]](_0x3e1e[6]);
    }
  };
  const _0x1d3f = (_0x1d40) => {
    _0x1c1f(_0x1d40.email);
    _0x1c21(_0x1d40.password);
    _0x1c23(_0x1d40.role);
    _0x1c2b(true);
    _0x1c2d(_0x1d40.email);
    _0x1c31(true);
  };
  const _0x1d41 = () => {
    _0x1c31(false);
    _0x1c2b(false);
    _0x1c1f(_0x3e1e[0]);
    _0x1c21(_0x3e1e[0]);
    _0x1c23(_0x3e1e[34]);
  };
  const _0x1d42 = (_0x1d27) => {
    const _0x1d43 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return _0x1d43[_0x3e1e[39]](String(_0x1d27).toLowerCase());
  };
  return (
    <div>
      <h1>Admin Page</h1>
      <Button type={_0x3e1e[28]} onClick={() => _0x1c31(true)}>
        Add User
      </Button>
      <Modal
        title={editMode ? _0x3e1e[1] : _0x3e1e[2]}
        open={modalVisible}
        onCancel={_0x1d41}
        footer={null}
      >
        <Form
          onFinish={_0x1d25}
          initialValues={{ email: email, password: password, role: role }}
          layout={_0x3e1e[3]}
        >
          <Form.Item
            label={_0x3e1e[9]}
            name={_0x3e1e[10]}
            rules={[{ required: true, message: _0x3e1e[11] }]}
          >
            <Input
              disabled={editMode}
              value={email}
              onChange={(_0x1d44) => setEmail(_0x1d44.target.value)}
            />
          </Form.Item>
          <Form.Item
            label={_0x3e1e[12]}
            name={_0x3e1e[13]}
            rules={[
              { required: true, message: _0x3e1e[14] },
              { min: 6, message: _0x3e1e[15] },
            ]}
          >
            <Input.Password
              value={password}
              onChange={(_0x1d45) => setPassword(_0x1d45.target.value)}
              iconRender={(visible) => (
                <Button
                  type={_0x3e1e[16]}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {visible ? _0x3e1e[17] : _0x3e1e[18]}
                </Button>
              )}
            />
          </Form.Item>
          <Form.Item label={_0x3e1e[19]} name={_0x3e1e[20]}>
            <Select value={role} onChange={(_0x1d46) => setRole(_0x1d46)}>
              <Option value={_0x3e1e[33]}>Employee</Option>
              <Option value={_0x3e1e[34]}>Admin</Option>
            </Select>
          </Form.Item>
          {error && <p style={{ color: _0x3e1e[5] }}>{error}</p>}
          {successMessage && (
            <p style={{ color: _0x3e1e[7] }}>{successMessage}</p>
          )}
          <Form.Item>
            <Button type={_0x3e1e[28]} htmlType={_0x3e1e[40]}>
              {editMode ? _0x3e1e[1] : _0x3e1e[2]}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <h2>Current Users</h2>
      <List
        dataSource={users}
        renderItem={(user) => (
          <List.Item
            actions={[
              <Button onClick={() => handleEditUser(user)} key={_0x3e1e[1]}>
                Edit
              </Button>,
              !user.isAdmin && (
                <Button
                  type={_0x3e1e[28]}
                  onClick={() => handleDeleteUser(user.email)}
                  key={_0x3e1e[3]}
                >
                  Delete
                </Button>
              ),
            ]}
          >
            {user.email} - {user.role}
          </List.Item>
        )}
      />
    </div>
  );
}
export default Admin;
